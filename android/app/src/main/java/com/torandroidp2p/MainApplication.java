package com.torandroidp2p;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.widget.Toast;

import com.reactnativenavigation.NavigationApplication;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.reactnativenavigation.controllers.ActivityCallbacks;

import java.util.Arrays;
import java.util.List;

import im.shimo.react.prompt.RNPromptPackage;
import info.guardianproject.netcipher.proxy.OrbotHelper;

import static android.app.Activity.RESULT_OK;

public class MainApplication extends NavigationApplication {
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
                new RNPromptPackage()
        );
    }

    @Override
    public List<ReactPackage> createAdditionalReactPackages() {
        return getPackages();
    }
}
