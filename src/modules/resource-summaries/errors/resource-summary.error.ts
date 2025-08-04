import { BadRequestException, NotFoundException } from '@nestjs/common';

export class NotFoundResourceSummary extends NotFoundException {
  constructor(message = 'Not found resource summary !', error?: string) {
    super(message, error);
  }
}

export class ResourceSummaryInvalidErr extends BadRequestException {
  constructor(message = 'resource summary invalid !', error?: string) {
    super(message, error);
  }
}
