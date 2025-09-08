import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { AgenService } from './agen.service';
import { CreateAgenDto } from './dto/create-agen.dto';
import { UpdateAgenDto } from './dto/update-agen.dto';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { RolesGuard } from '../../../auth/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../../common/enums/user-role.enum';

@Controller('agen')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AgenController {
    constructor(private readonly agenService: AgenService) { }

    // CREATE
    @Post()
    @Roles(UserRole.ADMIN)
    create(@Body() dto: CreateAgenDto) {
        return this.agenService.create(dto);
    }

    // READ ALL or ONE by Query
    @Get()
    @Roles(UserRole.ADMIN, UserRole.OPERATOR)
    async findAllOrOne(@Query('id_agen') idAgen?: number) {
        if (idAgen) {
            return this.agenService.findOne(+idAgen);
        }
        return this.agenService.findAll();
    }

    // READ ONE by Body JSON
    @Post('find')
    @Roles(UserRole.ADMIN, UserRole.OPERATOR)
    async findOneByBody(@Body('id_agen', ParseIntPipe) id: number) {
        if (!id) {
            throw new BadRequestException('id_agen harus disertakan dalam body');
        }
        return this.agenService.findOne(id);
    }

    // UPDATE via URL param
    @Patch(':id')
    @Roles(UserRole.ADMIN)
    updateByUrl(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAgenDto) {
        return this.agenService.update(id, dto);
    }

    // UPDATE via Body JSON
    @Patch()
    @Roles(UserRole.ADMIN)
    updateByBody(@Body() dto: UpdateAgenDto & { id_agen: number }) {
        if (!dto.id_agen) {
            throw new BadRequestException('id_agen harus disertakan dalam body');
        }
        return this.agenService.update(dto.id_agen, dto);
    }

    // DELETE via URL param
    @Delete(':id')
    @Roles(UserRole.ADMIN)
    removeByUrl(@Param('id', ParseIntPipe) id: number) {
        return this.agenService.remove(id);
    }

    // DELETE via Body JSON
    @Delete()
    @Roles(UserRole.ADMIN)
    removeByBody(@Body('id_agen', ParseIntPipe) id: number) {
        if (!id) {
            throw new BadRequestException('id_agen harus disertakan dalam body');
        }
        return this.agenService.remove(id);
    }
}