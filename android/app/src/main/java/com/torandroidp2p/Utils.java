package com.torandroidp2p;

import android.content.Context;
import android.content.SharedPreferences;

public class Utils {
    private static final String PREF_FILE_KEY = "com.torandroidp2p.PREFERENCE";

    public static SharedPreferences getSharedPreferences(Context ctx) {
        return ctx.getSharedPreferences(PREF_FILE_KEY, Context.MODE_PRIVATE);
    }
}
