require('dotenv').config();
const fs = require('fs');
const { parseAsync  } = require('json2csv');
const csv = require('csv-parser');
const logger = require('../configs/logger')

class ProcessRequestBody {

    profileRequest(req) {
        logger.info(`(ProcessRequestBody/profileRequest) Receiving: ${JSON.stringify(req)}`);
        this.generateCSV(req, 'track');
    }

    aliasRequest(req) {
        // logger.info(`(ProcessRequestBody/aliasRequest) Receiving: ${JSON.stringify(req)}`);
        this.generateCSV(req, 'alias');
    }

    smsRequest(req) {
        // logger.info(`(ProcessRequestBody/smsRequest) Receiving: ${JSON.stringify(req)}`);
        this.generateCSV(req, 'sms');
    }

    generateCSV(data, name) {
        if(name === 'track') {

        } else if (name === 'alias') {
            const fields = ['user_aliases.external_id', 'user_aliases.alias_label', 'user_aliases.alias_name'];
            const options = { fields, header: false, unwind: ['user_aliases'], unwindBlank: true, quote: '' };
            
            try {
                parseAsync(data, options)
                    .then(csv => {
                        //! Logic to write to database
                        // const parsed = this.parseCSV(csv);    
                        logger.info(`(generateCSV) Writing ${csv} to ALIAS file`);
                        if(csv != "") fs.appendFileSync('./outputs/alias.csv',  csv + '\n', 'utf8');
                    })
                    .catch(err => {
                        throw new Error(`Error from parseAsync ${err}`)
                    });
            } catch (err) {
                logger.error(err);
            }
        } else if (name === 'sms') {
            const fields = ['external_id', 'subscription_state'];
            const options = { fields, header: false, quote: ''};
            
            try {
                parseAsync(data, options)
                    .then(csv => {
                        //! Logic to write to database
                        logger.info(`(generateCSV) Writing ${csv} to SMS file`);
                        if(csv != "") fs.appendFileSync('./outputs/sms.csv',  csv + '\n', 'utf8');
                    })
                    .catch(err => {
                        console.error(err)
                    });
            } catch (err) {
                logger.error(err);
            }
        } else {

        }

    }

    parseCSV(input) {
        //TODO Need to work on transpose logic
    }

    
}

module.exports = ProcessRequestBody;

