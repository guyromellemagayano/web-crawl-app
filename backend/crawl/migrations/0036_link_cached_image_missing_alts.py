# Generated by Django 3.0.5 on 2021-02-09 09:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('crawl', '0035_fiforelation_data'),
    ]

    operations = [
        migrations.AddField(
            model_name='link',
            name='cached_image_missing_alts',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
    ]
