import os from 'os';
import moment from 'moment';
import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { HealCheckResponse } from './interfaces/healcheck';
import { MB, GB, MILISECOND, ONEHOUR } from '../../common/constants/unit';
@Controller('healcheck')
export class HealcheckController {
  @Get()
  @HttpCode(HttpStatus.OK)
  healCheck(): HealCheckResponse {
    const cpus = os.cpus();
    const { freemem, totalmem } = os;
    const numConfig = 100;

    // TODO: get free memmory and total memmorry
    const freeMem = Math.floor(freemem() / MB) / numConfig;
    const totalMem = Math.floor(totalmem() / GB);
    const usedMemPercent = (totalmem() - freemem()) / totalmem();
    const used = Math.floor(usedMemPercent * numConfig);

    // TODO: get idle cpu cores
    const { user, system } = process.cpuUsage();
    const cpuUsed = Math.floor((system / user) * numConfig);

    // TODO: convert uptime hh:mm:ss
    const uptime = process.uptime();
    const now = Date.now();
    const ms = moment(now + uptime).diff(moment(now));
    const time = `${Math.floor(uptime / ONEHOUR)}${moment.utc(ms * MILISECOND).format(':mm:ss')}`;

    // TODO: create healcheck info
    const { model, speed } = cpus[0];
    const healcheck = {
      uptime: time,
      cpus: {
        model: model || 'none',
        speed: `${speed}MHz` || 'none',
        cores: `${cpus.length} cores`,
        used: `${cpuUsed}%`,
      },
      mem: {
        swap: `${Math.floor(totalMem - freeMem)}GB/${totalMem}GB`,
        used: `${used}%`,
      },
      message: 'OK',
      timestamp: moment(Date.now()).format('yyyy/MM/DD - HH:mm'),
    };
    try {
      return healcheck;
    } catch (e) {
      healcheck.message = e;
      return healcheck;
    }
  }
}
