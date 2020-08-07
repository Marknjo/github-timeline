'use strict';

import fs from 'fs';
import path, { sep } from 'path';

interface Skippable {
  s: number;
}

interface Filled {
  c: number;
  l: number;
}

export type TMask = Partial<Skippable & Filled>;

class GithubDate extends Date {
  dStart: number = 7;
  dEnd: number = 18;

  set dayStart(num: number) {
    this.dStart = num;
  }

  set dayEnd(num: number) {
    this.dEnd = num;
  }

  constructor(date: Date | string | number) {
    super(date);
  }

  addDays(days: number): GithubDate {
    let date = new GithubDate(this.valueOf());

    date.setDate(date.getDate() + days);
    date.setHours(this.genRandomHour());
    date.setMinutes(this.genRandom60());
    date.setSeconds(this.genRandom60());
    date.setMilliseconds(this.genRandomMils());

    return <GithubDate>date;
  }

  genRandomHour = () => {
    return Math.floor(
      Math.random() * (this.dEnd - this.dStart + 1) + this.dStart
    );
  };

  genRandom60 = () => {
    return Math.floor(Math.random() * 60);
  };

  genRandomMils = () => {
    return Math.floor(Math.random() * 1000);
  };
}

class PrinterService {
  private msg = require('./../assets/messages');
  private files = require('./../assets/files');
  private randMsgs = true;
  private randFiles = true;
  private githubDate: GithubDate;
  private outDir: string;

  getRandomNumber = (max: number) => {
    return Math.floor(Math.random() * max);
  };

  set messages(messages: string[]) {
    this.msg = messages;
  }

  set fileNames(filenames: string[]) {
    this.files = filenames;
  }

  set randomizeMsg(isRand: boolean) {
    this.randMsgs = isRand;
  }

  set randomizeFiles(isRand: boolean) {
    this.randFiles = isRand;
  }

  set dayStart(num: number) {
    this.githubDate.dStart = num;
  }

  set dayEnd(num: number) {
    this.githubDate.dEnd = num;
  }

  constructor(startDate: Date | string | number, outFile: string) {
    this.githubDate = new GithubDate(startDate);

    this.outDir = (() => {
      let fileArr = outFile.split(sep);
      const dirs = fileArr.splice(0, fileArr.length - 1);
      return dirs.join(sep);
    })();
  }

  generateDemoFiles(key: string = 'fileNames') {
    let files: string = '';

    let filesArr: Array<string>;
    const incomingFilename = this.files;

    if (this.#isObject(incomingFilename)) {
      filesArr = incomingFilename[key];
    } else {
      filesArr = incomingFilename;
    }

    filesArr.forEach((filename) => {
      files += `.${sep}demos${sep}${filename} `;
    });

    return `touch ${files} \n`;
  }

  getTextFileName(fileNameId?: number, key: string = 'fileNames') {
    let filenames: Array<string>;
    const incomingFilename = this.files;

    if (this.#isObject(incomingFilename)) {
      filenames = incomingFilename[key];
    } else {
      filenames = incomingFilename;
    }

    if (!this.randFiles && fileNameId) {
      return filenames[fileNameId];
    }

    const randId = this.getRandomNumber(filenames.length);
    return filenames[randId];
  }

  getNextMessage(msgId?: number, key: string = 'messages') {
    let messages: Array<string>;
    const incomingMsg = this.msg;

    if (this.#isObject(incomingMsg)) {
      messages = incomingMsg[key];
    } else {
      messages = incomingMsg;
    }

    if (!this.randMsgs && msgId) {
      return messages[msgId];
    }

    const randId = this.getRandomNumber(messages.length);
    return messages[randId];
  }

  printStartMessage(outputFile: string) {
    console.log('Output file: ', outputFile);
    fs.writeFileSync(outputFile, '#!/bin/bash \r\n', 'utf-8');
    this.print(outputFile, '# :::::::::::::::::::::::::::::::::::::::::::: #');
  }

  getGitAddCommand(): string {
    return `git add .`;
  }

  getEchoCommand(message: string, fileNameId?: number) {
    return `echo "${message}" >> ./demos/${this.getTextFileName(fileNameId)}`;
  }

  getCommitMessage(date: Date, message: string) {
    return `git commit --date='${date.toLocaleString(
      'en-US'
    )}' -m '${message}'\n`;
  }

  print(outputFile: string, input: string) {
    fs.appendFileSync(outputFile, input + '\r\n', 'utf-8');
  }

  printFinalMessage(outputFile: string) {
    this.print(outputFile, '# :::::::::::::::::::::::::::::::::::::::::::: #');
    this.print(outputFile, '# :::::::::::::::::: END ::::::::::::::::::::: #');
    this.print(outputFile, '# :::::::::::::::::::::::::::::::::::::::::::: #');
  }

  printCommands(mask: TMask[], outputFile: string) {
    this.printStartMessage(outputFile);

    let currentDate: GithubDate = this.githubDate;
    let fileName: string = '';
    let message: string = '';
    let count = 0;

    // this.print(outputFile, this.generateDemoFiles())

    for (let i = 0; i < mask.length; i++) {
      if (mask[i].s) {
        currentDate = currentDate.addDays(mask[i].s!);
      } else {
        for (let j = 0; j < mask[i].l!; j++) {
          for (let k = 0; k < mask[i].c!; k++) {
            message = this.getNextMessage(count);
            fileName = this.getTextFileName(count);

            this.print(outputFile, this.getEchoCommand(message, count));

            this.print(outputFile, this.getGitAddCommand());

            this.print(outputFile, this.getCommitMessage(currentDate, message));

            //  this.print(outputFile, "\r\n");

            // use count
            count++;
          }
          currentDate = currentDate.addDays(1);
        }
      }
    }

    this.printFinalMessage(outputFile);
  }

  #isObject(message: Array<string> | { default: Array<string> }) {
    if (
      typeof message === 'object' &&
      message !== null &&
      !Array.isArray(message)
    ) {
      return true;
    }
    return false;
  }
}

export default PrinterService;
