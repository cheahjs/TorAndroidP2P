package com.torandroidp2p.receivers;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

import com.torandroidp2p.TorService;

public class OnBootReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent.getAction().equalsIgnoreCase(Intent.ACTION_BOOT_COMPLETED)) {
            Intent serviceIntent = new Intent(context, TorService.class);
            context.startService(serviceIntent);
        }
    }
}
