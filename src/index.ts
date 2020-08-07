'use strict';

import os from 'os';
import path from 'path';
import { exec } from 'child_process';
import shell from 'shelljs';

import PrinterSvc, { TMask } from './service/command-printer';

const tempDir: string = os.tmpdir(); // /tmp
// const tempDir: string = __dirname; // /tmp
const DEFAULT_OUTPUT_FILE = path.join(tempDir, 'github-commits.sh');

class GithubActivity {
  private static instance: GithubActivity | null = null;

  public static getInstance(
    mask: Array<TMask> | [],
    startDate: Date | string | number,
    outputFile = DEFAULT_OUTPUT_FILE
  ) {
    if (GithubActivity.instance === null) {
      GithubActivity.instance = new GithubActivity(mask, startDate, outputFile);
      return GithubActivity.instance;
    } else {
      return GithubActivity.instance;
    }
  }

  private outputFile: string = DEFAULT_OUTPUT_FILE;
  private mask: Array<TMask> | [] = [];
  private fileNames: string[] = [];
  private messages: string[] = [];

  public printerService: PrinterSvc;

  private constructor(
    mask: Array<TMask> | [],
    startDate: Date | string | number,
    outputFile = DEFAULT_OUTPUT_FILE
  ) {
    this.outputFile = outputFile;
    this.mask = mask;

    if (!startDate) {
      throw Error('Start date should be defined.');
    }

    if (!mask || mask.length < 1) {
      throw Error('Mask should be defined.');
    }
    this.printerService = new PrinterSvc(startDate, this.outputFile);
  }

  setMessages(messages: string[]) {
    this.printerService.messages = messages;
    return this;
  }

  setFileNames(files: string[]) {
    this.printerService.fileNames = files;
    return this;
  }

  setIsRandomMessage(isRand: boolean) {
    this.printerService.randomizeMsg = isRand;
    return this;
  }

  setIsRandomFiles(isRand: boolean) {
    this.printerService.randomizeFiles = isRand;
    return this;
  }

  set setDayStart(num: number) {
    this.printerService.dayStart = num;
  }

  set setDayEnd(num: number) {
    this.printerService.dayEnd = num;
  }

  printToFile() {
    this.printerService.printCommands(this.mask, this.outputFile);
    return this;
  }

  execute() {
    exec(`sh ${path.resolve(this.outputFile)}`, (error, stdout, stderr) => {
      console.log(stdout);
      console.log(stderr);
      if (error !== null) {
        console.log(`exec error: ${error}`);
      }
    });
  }
}

export default GithubActivity.getInstance;
