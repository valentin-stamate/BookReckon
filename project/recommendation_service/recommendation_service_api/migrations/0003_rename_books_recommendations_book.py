# Generated by Django 4.1.3 on 2022-11-30 16:56

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('recommendation_service_api', '0002_recommendations'),
    ]

    operations = [
        migrations.RenameField(
            model_name='recommendations',
            old_name='books',
            new_name='book',
        ),
    ]