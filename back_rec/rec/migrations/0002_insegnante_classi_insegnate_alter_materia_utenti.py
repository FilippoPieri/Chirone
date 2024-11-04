# Generated by Django 5.1.2 on 2024-11-04 16:40

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rec', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='insegnante',
            name='classi_insegnate',
            field=models.ManyToManyField(blank=True, related_name='insegnanti_insegnano', to='rec.classe'),
        ),
        migrations.AlterField(
            model_name='materia',
            name='utenti',
            field=models.ManyToManyField(related_name='materie_utente', to=settings.AUTH_USER_MODEL),
        ),
    ]
