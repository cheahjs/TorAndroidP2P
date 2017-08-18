package com.torandroidp2p;

import android.app.Service;
import android.content.Intent;
import android.os.Binder;
import android.os.IBinder;
import android.os.SystemClock;
import android.support.annotation.Nullable;
import android.util.Log;
import android.widget.Toast;

import com.facebook.common.logging.LoggingDelegate;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;

import org.json.JSONObject;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.Proxy;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import fi.iki.elonen.NanoHTTPD;
import info.guardianproject.netcipher.client.StrongBuilder;
import info.guardianproject.netcipher.client.StrongOkHttpClientBuilder;
import info.guardianproject.netcipher.proxy.OrbotHelper;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class TorService extends Service implements StrongBuilder.Callback<OkHttpClient> {
    private static final String TAG = "TorService";
    private OkHttpClient httpClient;
//    private List<Callback> responseCallbacks;
    private Callback responseCallback;
    private Map<String, Object> conditionMap = new HashMap<>();

    @Override
    public void onConnected(final OkHttpClient okHttpClient) {
        httpClient = okHttpClient;
        Log.d(TAG, "onConnected: ");
    }

    @Override
    public void onConnectionException(Exception e) {
//        Toast.makeText(this, "Failed to connect.", Toast.LENGTH_SHORT).show();
        Log.d(TAG, "onConnectionException: " + e);
    }

    @Override
    public void onTimeout() {
//        Toast.makeText(this, "Failed to connect.", Toast.LENGTH_SHORT).show();
        Log.d(TAG, "onTimeout: ");
    }

    @Override
    public void onInvalid() {
//        Toast.makeText(this, "Failed to connect.", Toast.LENGTH_SHORT).show();
        Log.d(TAG, "onInvalid: ");
    }

    public class TorServiceBinder extends Binder {
        TorService getService() {
            return TorService.this;
        }
    }

    @Override
    public void onCreate() {
        super.onCreate();
        Log.d(TAG, "onCreate: ");
        buildClient();
        try {
            new HSServer();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void buildClient() {
        try {
            Log.d(TAG, "buildClient: building httpclient");
//            StrongOkHttpClientBuilder
//                    .forMaxSecurity(this)
////                    .withTorValidation()
//                    .withBestProxy()
//                    .build(this);
            new Thread(new Runnable() {
                @Override
                public void run() {
                    httpClient = new OkHttpClient.Builder()
                            .proxy(new Proxy(Proxy.Type.HTTP, new InetSocketAddress("127.0.0.1", 8118)))
                            .readTimeout(20, TimeUnit.SECONDS)
                            .writeTimeout(20, TimeUnit.SECONDS)
                            .connectTimeout(20, TimeUnit.SECONDS)
                            .build();
                }
            }).start();
        } catch (Exception e) {
            e.printStackTrace();
            Toast.makeText(this, "Failed to build HTTP client.", Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.d(TAG, "onStartCommand: ");
        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        Log.d(TAG, "onBind: ");
        return mBinder;
    }

    private final IBinder mBinder = new TorServiceBinder();

    public void sendMessage(final String onionAddress, final String message, final Promise promise) throws Exception {
        Log.d(TAG, "sendMessage: sending " + message + " to " + onionAddress);
        if (httpClient == null)
        {
            promise.reject("E_NO_CLIENT", new NullPointerException());
            Toast.makeText(this, "No HTTP Client.", Toast.LENGTH_SHORT).show();
            return;
        }
        new Thread(new Runnable() {
            @Override
            public void run() {
                    //TODO: attempt to send message
                    RequestBody body = RequestBody.create(MediaType.parse("application/json; charset=utf-8"), message);
                    Request request = new Request.Builder()
                            .url("http://" + onionAddress + ":23153")
                            .post(body)
                            .build();
                    try {
                        Response response = httpClient.newCall(request).execute();
                        String responseString = response.body().string();
                        Log.i(TAG, responseString);
                        promise.resolve(responseString);
//                        for (Callback cb : responseCallbacks) {
//                            cb.invoke(onionAddress, responseString);
//                        }
                        responseCallback.invoke(onionAddress, responseString, null);
                    } catch (IOException e) {
                        e.printStackTrace();
                        promise.reject(e);
                }
            }
        }).start();
    }

    public void setResponseListener(Callback cb) {
//        if (responseCallbacks == null)
//            responseCallbacks = new LinkedList<>();
//        responseCallbacks.add(cb);
        responseCallback = cb;
    }

    public void setResponse(String key, String response) {
        Object lockObject = conditionMap.get(key);
        conditionMap.put(key, response);
        synchronized (lockObject) {
            lockObject.notify();
        }
    }

    public class HSServer extends NanoHTTPD {
        public HSServer() throws IOException {
            super(23153);
            Log.d(TAG, "HSServer: starting");
            start(15*1000, true);
        }

        @Override
        public Response serve(IHTTPSession session) {
            final StringBuilder buf = new StringBuilder();
            for (Map.Entry<String, String> kv : session.getHeaders().entrySet())
                buf.append(kv.getKey()).append(" : ").append(kv.getValue()).append("\n");
            Log.d(TAG, "serve: " + buf.toString());
            if (responseCallback == null) {
                Log.w(TAG, "serve: no callback found");
                return newFixedLengthResponse("{\"type\": \"NO_LISTENER\"}");
            }
            try {
                Log.d(TAG, "serve: getting data");
                final HashMap<String, String> map = new HashMap<>();
                session.parseBody(map);
                final String json = map.get("postData");
                String curTime = String.valueOf(System.nanoTime());
                Object lockObject = new Object();
                conditionMap.put(curTime, lockObject);
                Log.d(TAG, "serve: calling callback with " + json);
                responseCallback.invoke(null, json, curTime);
                synchronized (lockObject) {
                    Log.d(TAG, "serve: waiting for callback");
                    lockObject.wait(1500);
                    Object response = conditionMap.get(curTime);
                    Log.d(TAG, "serve: got response");
                    if (response instanceof String)
                        return newFixedLengthResponse((String) response);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
            return newFixedLengthResponse("{\"type\": \"FAILED\"}");
        }
    }
}
