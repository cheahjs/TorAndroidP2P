package com.torandroidp2p;

import android.app.Service;
import android.content.Intent;
import android.os.Binder;
import android.os.IBinder;
import android.support.annotation.Nullable;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.Promise;

import org.json.JSONObject;

import java.io.IOException;
import java.util.Map;

import fi.iki.elonen.NanoHTTPD;
import info.guardianproject.netcipher.client.StrongBuilder;
import info.guardianproject.netcipher.client.StrongOkHttpClientBuilder;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class TorService extends Service implements StrongBuilder.Callback<OkHttpClient> {
    private static final String TAG = "TorService";
    private OkHttpClient httpClient;

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
        buildClient();
        try {
            new HSServer();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void buildClient() {
        try {
            StrongOkHttpClientBuilder
                    .forMaxSecurity(this)
                    .withTorValidation()
                    .withBestProxy()
                    .build(this);
        } catch (Exception e) {
            e.printStackTrace();
            Toast.makeText(this, "Failed to build HTTP client.", Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return mBinder;
    }

    private final IBinder mBinder = new TorServiceBinder();

    public void sendMessage(final String onionAddress, final String message, final Promise promise) throws Exception {
        if (httpClient == null)
            promise.reject("E_NO_CLIENT", new NullPointerException());
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
                    } catch (IOException e) {
                        e.printStackTrace();
                        promise.reject(e);
                }
            }
        }).start();
    }

    public class HSServer extends NanoHTTPD {
        public HSServer() throws IOException {
            super(23153);
            start(15*1000, true);
        }

        @Override
        public Response serve(IHTTPSession session) {
            final StringBuilder buf = new StringBuilder();
            for (Map.Entry<String, String> kv : session.getHeaders().entrySet())
                buf.append(kv.getKey()).append(" : ").append(kv.getValue()).append("\n");
            return newFixedLengthResponse(buf.toString());
        }
    }
}
