/* @flow */
import type Application from "solfegejs-application/src/Application"
import type {BundleInterface, InitializableBundleInterface} from "solfegejs-application/src/BundleInterface"
import Configuration from "./Configuration"

/**
 * Configuration bundle
 */
export default class Bundle implements BundleInterface, InitializableBundleInterface
{
    /**
     * Get bundle path
     *
     * @return  {String}        The bundle path
     */
    getPath():string
    {
        return __dirname;
    }

    /**
     * Initialize the bundle
     *
     * @param   {Application}   application     Solfege application
     */
    initialize(application:Application)
    {
        application.setParameter("configuration", new Configuration);
    }
}
