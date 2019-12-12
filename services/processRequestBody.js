require('dotenv').config();
const fs = require('fs');
const { parseAsync  } = require('json2csv');
const csv = require('csv-parser');
const logger = require('../configs/logger')

class ProcessRequestBody {

    profileRequest(req, status) {
        logger.info(`(ProcessRequestBody/profileRequest) Receiving: ${JSON.stringify(req)}`);
        if (status === 201) this.generateCSV(req, 'track', status);
    }

    aliasRequest(req, status) {
        // logger.info(`(ProcessRequestBody/aliasRequest) Receiving: ${JSON.stringify(req)}`);
        this.generateCSV(req, 'alias', status);
    }

    smsRequest(req, status) {
        // logger.info(`(ProcessRequestBody/smsRequest) Receiving: ${JSON.stringify(req)}`);
        this.generateCSV(req, 'sms', status);
    }

    generateCSV(data, name, status) {
        if(name === 'track') {
            const jsonDoc = JSON.stringify(data.attributes);
            const _jsonDoc = jsonDoc.toString();
            const __jsonDoc = _jsonDoc.replace(/[\[\]']+/g, '').replace(/},/g, '}\n');

            if (status === 201 ) fs.appendFileSync(`./outputs/track.json`,  __jsonDoc + '\n', 'utf8');    
               
        } else if (name === 'alias') {

            const fields = ['user_aliases.external_id', 'user_aliases.alias_label', 'user_aliases.alias_name'];
            const options = { fields, header: false, unwind: ['user_aliases'], unwindBlank: true, quote: '' };
            
            try {
                parseAsync(data, options)
                    .then((csv) => {
                        //! Logic to write to database
                        logger.info(`(generateCSV) Writing ${csv} to ALIAS file`);
                        if(csv != "") fs.appendFileSync(`./outputs/alias.csv`,  csv.replace(/\n/g, `,${status}\n`) + `,${status}\n`, 'utf8');
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
                    .then((csv) => {
                        //! Logic to write to database
                        logger.info(`(generateCSV) Writing ${csv} to SMS file`);
                        if(csv != "") fs.appendFileSync(`./outputs/sms.csv`,  csv.replace(/\n/g, `,${status}\n`) + `,${status}\n`, 'utf8');
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

