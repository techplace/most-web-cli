/**
 * @license
 * MOST Web Framework 2.0 Codename Blueshift
 * Copyright (c) 2017, THEMOST LP All rights reserved
 *
 * Use of this source code is governed by an BSD-3-Clause license that can be
 * found in the LICENSE file at https://themost.io/license
 */
import path from 'path';
import fs from 'fs-extra';
import _ from 'lodash';
import {writeFileFromTemplate} from '../../util';

export const command = 'controller <name>';

export const desc = 'Generate a new controller';

export const builder = {
};

export function handler(argv) {
    //validating controller name
    if (!/^[a-zA-Z0-9_]+$/.test(argv.name)) {
        console.error('ERROR','Controller name is not valid. Expected only latin characters, numbers or "_" character.');
        return process.exit(1);
    }
    //get controller file name
    let controllerFile = _.dasherize(argv.name).concat('-controller.js');
    console.log('INFO',`Generating controller ${controllerFile}`);
    let controllerPath = path.resolve(process.cwd(), `server/controllers/${controllerFile}`);
    console.log('INFO',`Validating controller path ${controllerPath}`);
    if (fs.existsSync(controllerPath)) {
        console.error('ERROR','The specified controller already exists.');
        return process.exit(1);
    }
    //get template file path
    let templateFile = path.resolve(__dirname,'../../../templates/generate/controller.js.ejs');
    
    //get destination folder path
    let destFolder = path.dirname(controllerPath);
    console.error('INFO',`Validating controller folder (${destFolder}).`);
    fs.ensureDir(destFolder, (err)=> {
       if (err) {
           console.error('ERROR','An error occurred while validating destination path.');
            console.error(err);
       } 
       writeFileFromTemplate(templateFile, controllerPath, {
            name:_.upperFirst(_.camelCase(argv.name))
        }).then(()=> {
            console.log('INFO','The operation was completed succesfully.');
              return process.exit(0);
        }).catch((err)=> {
            console.error('ERROR','An error occurred while generating controller.');
            console.error(err);
            return process.exit(1);
        });
       
    });
    
}