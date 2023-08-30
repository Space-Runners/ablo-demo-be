import { ConfigModule, ConfigService } from '@nestjs/config';

export const jwtOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    secret: configService.get('JWT_SECRET'),
    signOptions: { expiresIn: '3d' },
  }),
  inject: [ConfigService],
};
