# Generated by Django 5.1.2 on 2024-10-24 17:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rec', '0003_remove_materia_classi'),
    ]

    operations = [
        migrations.AddField(
            model_name='insegnante',
            name='classi',
            field=models.ManyToManyField(related_name='insegnanti', to='rec.classe'),
        ),
    ]
