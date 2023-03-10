# Generated by Django 3.0.5 on 2020-10-28 15:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('crawl', '0023_auto_20201022_0938'),
    ]

    operations = [
        migrations.AddField(
            model_name='link',
            name='cached_is_image',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='link',
            name='cached_is_link',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='link',
            name='cached_is_script',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='link',
            name='cached_is_stylesheet',
            field=models.BooleanField(default=False),
        ),
    ]
