# Generated manually to fix Docker synchronization and align Supabase

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("app", "0002_alter_branchproductoffer_options_and_more"),
    ]

    operations = [
        # 1. Remove the old unique constraint if it exists
        migrations.RunSQL(
            'ALTER TABLE "app_branchsupermarket" DROP CONSTRAINT IF EXISTS "BranchSupermarket_coordinates_and_parent_supermarket_uniqueness";',
            reverse_sql=migrations.RunSQL.noop,
        ),
        
        # 2. Re-create the unique constraint safely through Django's state
        migrations.RunSQL(
            'ALTER TABLE "app_branchsupermarket" DROP CONSTRAINT IF EXISTS "unique_coordinates_parent_supermarket";',
            reverse_sql=migrations.RunSQL.noop,
            state_operations=[
                migrations.AddConstraint(
                    model_name="branchsupermarket",
                    constraint=models.UniqueConstraint(
                        fields=("coordinates", "parent_supermarket"),
                        name="unique_coordinates_parent_supermarket",
                    ),
                ),
            ],
        ),

        # 3. Apply the product measurement unit alteration that Django detected
        migrations.AlterField(
            model_name="product",
            name="measurement_unit",
            field=models.CharField(max_length=20),
        ),
    ]