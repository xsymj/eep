package com.gson.plugin;

/**
 * Created by 夏悸沫 on 14-3-18.
 */
public abstract class AbstractPlugin implements Plugin {

    public Boolean install() {
        return true;
    }

    public Boolean uninstall() {
        return true;
    }

    public Boolean upgrade() {
        return true;
    }
}
