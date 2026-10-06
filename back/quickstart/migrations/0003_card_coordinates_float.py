from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('quickstart', '0002_wire_fromid_wire_fromside_wire_toid_wire_toside_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='card',
            name='x',
            field=models.FloatField(),
        ),
        migrations.AlterField(
            model_name='card',
            name='y',
            field=models.FloatField(),
        ),
        migrations.AlterField(
            model_name='card',
            name='width',
            field=models.FloatField(),
        ),
        migrations.AlterField(
            model_name='card',
            name='height',
            field=models.FloatField(),
        ),
    ]
