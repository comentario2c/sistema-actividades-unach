import { PartialType } from '@nestjs/mapped-types';
import { CreateParticipacioneDto } from './create-participacione.dto';

export class UpdateParticipacioneDto extends PartialType(CreateParticipacioneDto) {}
