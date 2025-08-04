import { BadRequestException, NotFoundException } from '@nestjs/common';

export class NotFoundProjectSituationErr extends NotFoundException {
  constructor(message = 'not found project situation', error?: string) {
    super(message, error);
  }
}

export class ProjectSituationInvalidErr extends BadRequestException {
  constructor(message = 'project situation in valid', error?: string) {
    super(message, error);
  }
}
