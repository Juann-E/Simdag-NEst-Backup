import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { SpbeService } from './spbe.service';
import { CreateSpbeDto } from './dto/create-spbe.dto';
import { UpdateSpbeDto } from './dto/update-spbe.dto';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { RolesGuard } from '../../../auth/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../../common/enums/user-role.enum';

@Controller('spbe')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SpbeController {
    constructor(private readonly spbeService: SpbeService) { }

    // CREATE
    @Post()
    @Roles(UserRole.ADMIN)
    create(@Body() dto: CreateSpbeDto) {
        return this.spbeService.create(dto);
    }

    // READ ALL or ONE by Query
    @Get()
    @Roles(UserRole.ADMIN, UserRole.OPERATOR)
    async findAllOrOne(@Query('id_spbe') idSpbe?: number) {
        if (idSpbe) {
            return this.spbeService.findOne(+idSpbe);
        }
        return this.spbeService.findAll();
    }

    // READ ONE by Body JSON
    @Post('find')
    @Roles(UserRole.ADMIN, UserRole.OPERATOR)
    async findOneByBody(@Body('id_spbe', ParseIntPipe) id: number) {
        if (!id) {
            throw new BadRequestException('id_spbe harus disertakan dalam body');
        }
        return this.spbeService.findOne(id);
    }

    // UPDATE via URL param
    @Patch(':id')
    @Roles(UserRole.ADMIN)
    updateByUrl(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSpbeDto) {
        return this.spbeService.update(id, dto);
    }

    // UPDATE via Body JSON
    @Patch()
    @Roles(UserRole.ADMIN)
    updateByBody(@Body() dto: UpdateSpbeDto & { id_spbe: number }) {
        if (!dto.id_spbe) {
            throw new BadRequestException('id_spbe harus disertakan dalam body');
        }
        return this.spbeService.update(dto.id_spbe, dto);
    }

    // DELETE via URL param
    @Delete(':id')
    @Roles(UserRole.ADMIN)
    removeByUrl(@Param('id', ParseIntPipe) id: number) {
        return this.spbeService.remove(id);
    }

    // DELETE via Body JSON
    @Delete()
    @Roles(UserRole.ADMIN)
    removeByBody(@Body('id_spbe', ParseIntPipe) id: number) {
        if (!id) {
            throw new BadRequestException('id_spbe harus disertakan dalam body');
        }
        return this.spbeService.remove(id);
    }
}