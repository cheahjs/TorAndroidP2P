package com.torandroidp2p;

import android.os.Bundle;
import android.support.annotation.Nullable;

import com.reactnativenavigation.controllers.SplashActivity;

import info.guardianproject.netcipher.proxy.OrbotHelper;

public class MainActivity extends SplashActivity {
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        OrbotHelper.get(this).init();
    }
}
