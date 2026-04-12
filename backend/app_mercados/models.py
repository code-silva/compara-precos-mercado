from django.contrib.gis.db import models as gis_models
from django.db import models


class Categoria(models.Model):
    """Classe representante da entidade 'Categoria' do banco de dados."""

    nome = models.CharField(max_length=50, blank=False, unique=True)
    prioridade = models.IntegerField(null=False, blank=False, unique=True)

    class Meta:
        verbose_name = "Categoria"
        verbose_name_plural = "Categorias"


class Produto(models.Model):
    """Classe representante da entidade 'Produto' do banco de dados."""

    class UnidadeMedida(models.TextChoices):
        KG = "KG", "Quilograma"
        G = "G", "Grama"
        L = "L", "Litro"
        ML = "ML", "Mililitro"
        UN = "UN", "Unidade"

    nome = models.CharField(max_length=50, blank=False)
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, related_name="produtos")
    marca = models.CharField(max_length=50, blank=False)
    medida = models.DecimalField(max_digits=10, decimal_places=2)
    imagem = models.ImageField(upload_to="produtos/")

    unidade_medida = models.CharField(
        max_length=50, choices=UnidadeMedida.choices, default=UnidadeMedida.UN
    )

    ean = models.CharField(max_length=20, unique=True, blank=True, null=True)

    def __str__(self):
        return f"{self.nome} {self.marca} - {self.medida}{self.unidade_medida}"

    class Meta:
        verbose_name = "Produto"
        verbose_name_plural = "Produtos"


class MercadoMatriz(models.Model):
    """Classe representante da entidade 'Mercado Matriz' do banco de dados."""

    nome = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.nome}"

    class Meta:
        verbose_name = "Mercado Matriz"
        verbose_name_plural = "Mercados Matrizes"


class Oferta(models.Model):
    """Classe representante da entidade 'Oferta' do banco de dados."""

    url = models.URLField(max_length=2083, blank=False)
    data_validade = models.DateField()

    def __str__(self):
        return f"Validade em {self.data_validade}"

    class Meta:
        verbose_name = "Oferta"
        verbose_name_plural = "Ofertas"


class Denuncia(models.Model):
    """Classe representante da entidade 'Denúncia' do banco de dados."""

    class MotivoDenuncia(models.TextChoices):
        PRECO_ERRADO = "PE", "Preço Errado"
        PRODUTO_INEXISTENTE = "PI", "Produto Inexistente"
        OFERTA_EXPIRADA = "OE", "Oferta Expirada"
        OUTRO = "O", "Outro"

    class Status(models.TextChoices):
        RESOLVIDO = "R", "Resolvido"
        PENDENTE = "P", "Pendente"
        IMPROCEDENTE = "I", "Improcedente"

    motivo = models.CharField(max_length=20, choices=MotivoDenuncia.choices)
    descricao = models.CharField(max_length=500, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices)
    id_dispositivo = models.CharField(max_length=255)
    oferta = models.ForeignKey(Oferta, on_delete=models.CASCADE, related_name="denuncias")

    data_criacao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Denúncia {self.get_motivo_display()} - {self.get_status_display()}"

    class Meta:
        verbose_name = "Denúncia"
        verbose_name_plural = "Denúncias"


class Localidade(models.Model):
    """Classe representante da entidade 'Localização' do banco de dados."""

    class UF(models.TextChoices):
        AC = "AC", "Acre"
        AL = "AL", "Alagoas"
        AP = "AP", "Amapá"
        AM = "AM", "Amazonas"
        BA = "BA", "Bahia"
        CE = "CE", "Ceará"
        DF = "DF", "Distrito Federal"
        ES = "ES", "Espírito Santo"
        GO = "GO", "Goiás"
        MA = "MA", "Maranhão"
        MT = "MT", "Mato Grosso"
        MS = "MS", "Mato Grosso do Sul"
        MG = "MG", "Minas Gerais"
        PA = "PA", "Pará"
        PB = "PB", "Paraíba"
        PR = "PR", "Paraná"
        PE = "PE", "Pernambuco"
        PI = "PI", "Piauí"
        RJ = "RJ", "Rio de Janeiro"
        RN = "RN", "Rio Grande do Norte"
        RS = "RS", "Rio Grande do Sul"
        RO = "RO", "Rondônia"
        RR = "RR", "Roraima"
        SC = "SC", "Santa Catarina"
        SP = "SP", "São Paulo"
        SE = "SE", "Sergipe"
        TO = "TO", "Tocantins"

    uf = models.CharField(max_length=20, choices=UF.choices)
    cidade = models.CharField(max_length=50, blank=False)

    def __str__(self):
        return f"Estado: {self.uf}, Cidade: {self.cidade}"

    class Meta:
        verbose_name = "Localidade"
        verbose_name_plural = "Localidades"


class MercadoFilial(models.Model):
    """Classe representante da entidade 'Mercado Filial' do banco de dados."""

    coordenadas = gis_models.PointField(geography=True, srid=4326)
    localidade = models.ForeignKey(Localidade, on_delete=models.CASCADE, related_name="filiais")
    mercado_matriz = models.ForeignKey(
        MercadoMatriz, on_delete=models.CASCADE, related_name="filiais"
    )

    def __str__(self):
        return f"{self.mercado_matriz.nome} - {self.localidade.cidade}"

    class Meta:
        verbose_name = "Mercado Filial"
        verbose_name_plural = "Mercados Filiais"


class Produto_Oferta_Filial(models.Model):
    """Classe representante da entidade associativa, que realiza a ligação
    do relacioamento ternário entre 'Produto', 'Oferta' e 'Mercado Filial'.
    """

    produto = models.ForeignKey(Produto, on_delete=models.CASCADE, related_name="ternario")
    mercado_filial = models.ForeignKey(
        MercadoFilial, on_delete=models.CASCADE, related_name="ternario"
    )
    oferta = models.ForeignKey(Oferta, on_delete=models.CASCADE, related_name="ternario")
    preco = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.produto.nome} em {self.mercado_filial}: R$ {self.preco}"

    class Meta:
        verbose_name = "Ofertado"
        verbose_name_plural = "Ofertados"
