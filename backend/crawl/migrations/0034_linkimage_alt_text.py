# Generated by Django 3.0.5 on 2021-01-27 16:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('crawl', '0033_auto_20210127_1411'),
    ]

    operations = [
        migrations.AddField(
            model_name='linkimage',
            name='alt_text',
            field=models.TextField(blank=True, null=True),
        ),
    ]
