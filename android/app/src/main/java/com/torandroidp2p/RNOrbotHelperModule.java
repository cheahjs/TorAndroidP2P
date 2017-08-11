package com.torandroidp2p;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.IBinder;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import info.guardianproject.netcipher.proxy.OrbotHelper;
import info.guardianproject.netcipher.proxy.StatusCallback;

public class RNOrbotHelperModule extends ReactContextBaseJavaModule {
    private OrbotHelper orbotHelper;
    private String orbotStatus = OrbotHelper.STATUS_OFF;
    private static final String STATUS_NOT_INSTALLED = "NOT_INSTALLED";
    private static final String STATUS_TIMEDOUT = "TIMED_OUT";


    public RNOrbotHelperModule(ReactApplicationContext reactContext) {
        super(reactContext);
        orbotHelper = OrbotHelper.get(getReactApplicationContext());
        orbotHelper.addInstallCallback(new OrbotHelper.InstallCallback() {
            @Override
            public void onInstalled() {

            }

            @Override
            public void onInstallTimeout() {

            }
        }).addStatusCallback(new StatusCallback() {
            @Override
            public void onEnabled(Intent intent) {
                orbotStatus = OrbotHelper.STATUS_ON;
            }

            @Override
            public void onStarting() {
                orbotStatus = OrbotHelper.STATUS_STARTING;
            }

            @Override
            public void onStopping() {
                orbotStatus = OrbotHelper.STATUS_STOPPING;
            }

            @Override
            public void onDisabled() {
                orbotStatus = OrbotHelper.STATUS_STARTS_DISABLED;
            }

            @Override
            public void onStatusTimeout() {
                orbotStatus = STATUS_TIMEDOUT;
            }

            @Override
            public void onNotYetInstalled() {
                orbotStatus = STATUS_NOT_INSTALLED;
            }
        });
        orbotHelper.requestStatus(reactContext);
    }

    @Override
    public String getName() {
        return "OrbotHelper";
    }

    @ReactMethod
    public boolean isInstalled() {
        return OrbotHelper.get(getReactApplicationContext()).isInstalled();
    }

    @ReactMethod
    public boolean isRunning() {
        return orbotStatus.equalsIgnoreCase(OrbotHelper.STATUS_ON);
    }

    @ReactMethod
    public void startOrbot() {
        OrbotHelper.requestStartTor(getReactApplicationContext());
    }

    @ReactMethod
    public void getOrbotStatus() {
        Intent intent = new Intent(OrbotHelper.ACTION_STATUS);
        intent.setPackage(OrbotHelper.ORBOT_PACKAGE_NAME);
        getReactApplicationContext().sendBroadcast(intent);
    }

    @ReactMethod
    public void requestHiddenServicePort(int port) {

    }

    @ReactMethod
    public void setServiceEnabled(boolean val) {
        getReactApplicationContext().getSharedPreferences("", Context.MODE_PRIVATE)
        .edit().putBoolean("service_enabled", val).apply();
    }

    @ReactMethod
    public void bindService() {
        doBindService();
    }

    @ReactMethod
    public void sendMessage(String onionAddress, String message, Promise promise) {
        if (!mIsBound) {
            promise.reject("E_SERVICE_NOT_BOUND", new Exception());
            return;
        }
        try {
            mBoundService.sendMessage(onionAddress, message, promise);
        } catch (Exception e) {
            e.printStackTrace();
            promise.reject(e);
        }
    }

    private TorService mBoundService;
    private boolean mIsBound;

    private ServiceConnection mConnection = new ServiceConnection() {
        public void onServiceConnected(ComponentName className, IBinder service) {
            // This is called when the connection with the service has been
            // established, giving us the service object we can use to
            // interact with the service.  Because we have bound to a explicit
            // service that we know is running in our own process, we can
            // cast its IBinder to a concrete class and directly access it.
            mBoundService = ((TorService.TorServiceBinder)service).getService();
        }

        public void onServiceDisconnected(ComponentName className) {
            // This is called when the connection with the service has been
            // unexpectedly disconnected -- that is, its process crashed.
            // Because it is running in our same process, we should never
            // see this happen.
            mBoundService = null;
        }
    };

    void doBindService() {
        if (!mIsBound) {
            Context context = getReactApplicationContext();
            // Establish a connection with the service.  We use an explicit
            // class name because we want a specific service implementation that
            // we know will be running in our own process (and thus won't be
            // supporting component replacement by other applications).
            context.bindService(new Intent(context,
                    TorService.class), mConnection, Context.BIND_AUTO_CREATE);
            mIsBound = true;
        }
    }

    void doUnbindService() {
        if (mIsBound) {
            // Detach our existing connection.
            getReactApplicationContext().unbindService(mConnection);
            mIsBound = false;
        }
    }
}
