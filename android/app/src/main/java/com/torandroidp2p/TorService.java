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
        Toast.makeText(this, "Failed to connect.", Toast.LENGTH_SHORT).show();
    }

    @Override
    public void onTimeout() {
        Toast.makeText(this, "Failed to connect.", Toast.LENGTH_SHORT).show();
    }

    @Override
    public void onInvalid() {
        Toast.makeText(this, "Failed to connect.", Toast.LENGTH_SHORT).show();
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
                        Log.i(TAG, response.body().toString());
                        promise.resolve(response.body().toString());
                    } catch (IOException e) {
                        e.printStackTrace();
                }
            }
        }).start();
    }
}
