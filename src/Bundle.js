/* @flow */
import configYaml from "config-yaml"
import type Application from "solfegejs/src/Application"
import type Configuration from "solfegejs/src/Configuration"

/**
 * Configuration bundle
 */
export default class Bundle
{
    /**
     * Solfege application
     */
    application:Application;

    /**
     * Constructor
     */
    constructor():void
    {
    }

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
        this.application = application;

        // Listen the end of configuration loading
        this.application.on("configuration_load", this.onConfigurationLoad);
    }

    /**
     * The configuration is loading
     *
     * @param   {Application}   application     Solfege application
     * @param   {Configuration} configuration   Solfege configuration
     * @param   {string}        filePath        Configuration file path
     * @param   {string}        format          File format
     */
    onConfigurationLoad(application:Application, configuration:Configuration, filePath:string, format:string)
    {
        // Check the format
        if (format !== "yaml") {
            return;
        }

        let properties = {};

        // Parse YAML file
        try {
            properties = configYaml(filePath, {encoding: "utf8"});
        } catch (error) {
            // Unable to parse YAML file
            console.error(error);
            return;
        }

        // Add properties to configuration
        configuration.addProperties(properties);
    }
}
