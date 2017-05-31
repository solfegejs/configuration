/* @flow */
import configYaml from "config-yaml"
import bindGenerator from "bind-generator"

/**
 * Configuration bundle
 */
export default class Bundle
{
    /**
     * Solfege application
     */
    application:any;

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
     * @param   {ApplicationInterface}  application     Solfege application
     */
    *initialize(application:any):Generator<void,void,void>
    {
        this.application = application;

        // Listen the end of configuration loading
        this.application.on("configuration_load", bindGenerator(this, this.onConfigurationLoad));
    }

    /**
     * The configuration is loading
     *
     * @param   {ApplicationInterface}      application     Solfege application
     * @param   {ConfigurationInterface}    configuration   Solfege configuration
     * @param   {string}                    filePath        Configuration file path
     * @param   {string}                    format          File format
     */
    *onConfigurationLoad(application:*, configuration:*, filePath:string, format:string):Generator<void,void,void>
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
