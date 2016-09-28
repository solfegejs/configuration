import configYaml from "config-yaml";
import bindGenerator from "bind-generator";

/**
 * Configuration bundle
 */
export default class Bundle
{
    /**
     * Constructor
     */
    constructor()
    {
        // Declare application property
        this.application;
    }

    /**
     * Get bundle path
     *
     * @return  {String}        The bundle path
     */
    getPath()
    {
        return __dirname;
    }

    /**
     * Initialize the bundle
     *
     * @param   {solfegejs/kernel/Application}  application     Solfege application
     */
    *initialize(application)
    {
        this.application = application;

        // Listen the end of configuration loading
        this.application.on("configuration_load", bindGenerator(this, this.onConfigurationLoad));
    }

    /**
     * The configuration is loading
     *
     * @param   {solfegejs/kernel/Application}      application     Solfege application
     * @param   {solfegejs/kernel/Configuration}    configuration   Solfege configuration
     * @param   {string}                            filePath        Configuration file path
     * @param   {string}                            format          File format
     */
    *onConfigurationLoad(application, configuration, filePath:string, format:string)
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
            return;
        }

        // Add properties to configuration
        configuration.addProperties(properties);
    }
}
