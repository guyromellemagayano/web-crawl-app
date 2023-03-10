# Generated by Django 3.0.5 on 2020-07-29 16:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('crawl', '0014_pagedata'),
    ]

    operations = [
        migrations.AddField(
            model_name='link',
            name='images',
            field=models.ManyToManyField(blank=True, related_name='image_pages', to='crawl.Link'),
        ),
        migrations.AddField(
            model_name='link',
            name='scripts',
            field=models.ManyToManyField(blank=True, related_name='script_pages', to='crawl.Link'),
        ),
        migrations.AddField(
            model_name='link',
            name='stylesheets',
            field=models.ManyToManyField(blank=True, related_name='stylesheet_pages', to='crawl.Link'),
        ),
    ]
