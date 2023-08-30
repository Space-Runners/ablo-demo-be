import { MigrationInterface, QueryRunner } from 'typeorm';
import { Currency } from '../../template/currency/currency.entity';
import { Size } from '../../template/size/size.entity';

export class CurrencyAndSizeDefaults1692787508966
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Default Currencies
    await queryRunner.manager.save(
      queryRunner.manager.create<Currency>(Currency, [
        { name: 'USD' },
        { name: 'EUR' },
      ]),
    );
    // Default Sizes
    await queryRunner.manager.save(
      queryRunner.manager.create<Size>(Size, [
        { name: 'XXS' },
        { name: 'XS' },
        { name: 'S' },
        { name: 'M' },
        { name: 'L' },
        { name: 'XL' },
        { name: 'XXL' },
      ]),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.manager.delete<Currency>(Currency, {});
    queryRunner.manager.delete<Size>(Size, {});
  }
}
