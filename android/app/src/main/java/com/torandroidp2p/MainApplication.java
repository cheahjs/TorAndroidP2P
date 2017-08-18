package com.torandroidp2p;

import android.content.Intent;
import android.util.Log;
import android.widget.Toast;

import com.BV.LinearGradient.LinearGradientPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.aakashns.reactnativedialogs.ReactNativeDialogsPackage;
import com.facebook.react.ReactPackage;
import com.horcrux.svg.SvgPackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.controllers.ActivityCallbacks;

import java.util.Arrays;
import java.util.List;

import im.shimo.react.prompt.RNPromptPackage;
import info.guardianproject.netcipher.proxy.OrbotHelper;

import static android.app.Activity.RESULT_OK;

public class MainApplication extends NavigationApplication {
    private static final String TAG = "MainApplication";

    @Override
    public void onCreate() {
        super.onCreate();
        setActivityCallbacks(new ActivityCallbacks() {
            @Override
            public void onActivityResult(int requestCode, int resultCode, Intent data) {
                //TODO: Handle hidden service result here
                if (resultCode != RESULT_OK)
                    return;
                String hsHost = data.getStringExtra("hs_host");
                Toast.makeText(MainApplication.this, "Got hidden service: " + hsHost, Toast.LENGTH_SHORT).show();
                Utils.getSharedPreferences(MainApplication.this)
                        .edit()
                        .putString("onion_address", hsHost)
                        .commit();
            }
        });
        Log.d(TAG, "onCreate: init orbothelper");
        OrbotHelper.get(this)
                .skipOrbotValidation()
                .init();
        Intent serviceIntent = new Intent(this, TorService.class);
        startService(serviceIntent);
    }

    @Override
    public boolean isDebug() {
        // Make sure you are using BuildConfig from your own application
        return BuildConfig.DEBUG;
    }

    protected List<ReactPackage> getPackages() {
        // Add additional packages you require here
        // No need to add RnnPackage and MainReactPackage
        return Arrays.<ReactPackage>asList(
                new VectorIconsPackage(),
                new RNFetchBlobPackage(),
                new RNOrbotHelperPackage(),
                new RNPromptPackage(),
                new LinearGradientPackage(),
                new SvgPackage(),
                new RCTCameraPackage(),
                new ReactNativeDialogsPackage()
        );
    }

    @Override
    public List<ReactPackage> createAdditionalReactPackages() {
        return getPackages();
    }
}
