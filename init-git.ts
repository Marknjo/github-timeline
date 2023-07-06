import githubActivity from './src';
import MaskRepository from './src/assets/masks';

let startDate = '2020-08-07';
let mask = MaskRepository.UA_COAT_OF_ARMS;

let gh = githubActivity(mask, startDate, './tmp/commits.sh');

gh.printToFile();

// gh.execute()
