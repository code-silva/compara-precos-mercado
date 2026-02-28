from django.db import models


class Categoria(models.Model):
    nome = models.CharField(max_length=50, blank=False, unique=True)



class Produto(models.Model):
    class UnidadeMedida(models.TextChoices):
        KG = 'KG', 'Quilograma'
        G = 'G', 'Grama'
        L = 'L', 'Litro'
        ML = 'ML', 'Mililitro',
        UN = 'UN', 'Unidade'


    nome = models.CharField(max_length=50, blank=False)
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, related_name='produtos')
    marca = models.CharField(max_length=50, blank=False)
    medida = models.DecimalField(max_digits=10, decimal_places=2)
    imagem = models.ImageField(upload_to='produtos/')

    unidade_medida = models.CharField(
        choices=UnidadeMedida.choices,
        default=UnidadeMedida.UN
    )

    ean = models.CharField(max_length=20, unique=True, blank=True, null=True)


    def __str__(self):
        return f"{self.nome} {self.marca} - {self.medida}{self.unidade}"