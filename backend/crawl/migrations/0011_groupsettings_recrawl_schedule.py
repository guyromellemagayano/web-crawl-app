# Generated by Django 3.0.5 on 2020-07-23 15:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('crawl', '0010_create_basic_user_group'),
    ]

    operations = [
        migrations.AddField(
            model_name='groupsettings',
            name='recrawl_schedule',
            field=models.CharField(default='0 18 * * 0', max_length=63),
        ),
    ]
