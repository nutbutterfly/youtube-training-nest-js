import { Controller, Get } from '@nestjs/common';
import { Public } from './config/public.decorator';

@Controller()
export class HealthController {

  @Public()
  @Get()
  health() {
    return { status: 'UP' };
  }
}
