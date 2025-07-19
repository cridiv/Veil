import { IsString, Matches, MinLength, Length } from 'class-validator'

export class CreateRoomDto {
@IsString()
@MinLength(3)
title: string;

@IsString()
@Matches(/^[a-z0-9\-]+$/, { message: 'Slug can only contain lowercase letters, numbers, and hyphens' })
@Length(3, 30)
slug: string;
}
