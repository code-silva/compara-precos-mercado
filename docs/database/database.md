# Banco de Dados

## 1. Visão Geral
Esta secção tem por objetivo explicar a base de dados que será utilizada neste projeto. Para isso, foi realizada a confecção de 2 diagramas: o **Diagrama Entidade-Relacionamento**, focado nas regras de negócio e nos relacionamentos entre as **Entidades**, e o **Diagrama Lógico de Dados**, focado nas regras de implementação do banco de dados e nos tipos de dados.

## 2. DER e DLD

### 2.1 Entidades
- **Product**: Itens comercializáveis (ex: arroz, feijão).
- **Category**: Classificação taxonômica dos produtos (ex: Higiene, Alimentos).
- **ParentSupermarket**: Entidade jurídica/matriz da rede de supermercados.
- **BranchSupermarket**: Unidade física (filial) onde as ofertas ocorrem.
- **Offer**: Entidade que agrupa um conjunto de promoções (ex: Encarte de Verão).
- **Report**: Feedback do usuário sobre a integridade de uma oferta.

### 2.2 Atributos

<i>Obs: Atributos <u>sublinhados</u> representam a chave primária, enquanto atributos com cerquilha(#) representam chaves estrangeiras.</i>

- **Product**(<u>id</u>, #category, name, brand, measurement, measurement_unit, european_article_number, image)
- **Category**(<u>id</u>, name, priority)
- **ParentSupermarket**(<u>id</u>, name)
- **BranchSupermarket**(<u>id</u>, #parent_supermarket, coordinates, state, city)
- **Offer**(<u>id</u>, url, expiration_date)
- **Report**(<u>id</u>, #offer, reason, description, status, device_id, creation_date)

### 2.3 Relacionamentos

1. Product - **pertence** - Category<br>
Um **Product** pertence a obrigatoriamente uma única **Category**, enquanto uma **Category** pode fazer parte de nenhum ou vários **Product**.
<br>
**Cardinalidade: (0,n): (1,1)**
<br><br>

2. ParentSupermarket- **possui** - BranchSupermarket <br>
Um **ParentSupermarket** possui ao menos um ou vários **BranchSupermarket**, enquanto um **BranchSupermarket** faz parte de obrigatoriamente de apenas um **ParentSupermarket**.
<br>
**Cardinalidade: (1,1) : (1,n)**
<br><br>

3. Offer - **possui** - Report <br>
Uma **Offer** possui zero ou vários **Report**, enquanto um **Report** faz parte de obrigatoriamente de apenas uma **Offer**.
<br>
**Cardinalidade: (1,1) : (0:n)**
<br><br>

4. Offer - Product - BranchSupermarket - **offered** <br>
Um **Product** e uma **Offer** são oferecidas obrigatoriamente por um único **BranchSupermarket**. Um **Product** e um **BranchSupermarket** são oferecidas obrigatoriamente por uma única **Offer**. E em uma **Offer** e um **BranchSupermarket**  podem ser oferecidas ao menos um ou vários **Product**.
<br>
**Cardinalidade: (1,1) : (1,n) : (1:1)**

### 2.4 Diagramas

`Diagrama Entidade-Relacionamento`
<div align="center">
  <img src="../../img/database/der.png" alt="Diagrama Entidade-Relacionamento" style="border: 1px solid black;">
</div>

`Diagrama Lógico de Dados`
<div align="center">
  <img src="../../img/database/dld.png" alt="Diagrama Lógico de Dados" style="border: 1px solid black;">
</div>

## 3. Dicionário de Dados

### 3.1 Category
| Atributo | Tipo | Propriedades | Descrição |
| :--- | :--- | :--- | :--- |
| id | INT | PK, Auto-increment, Obrigatório | Identificador único da tupla, automaticamente atribuído pelo SGBD. |
| name | VARCHAR(50) | Obrigatório, Único | Nome da categoria. |
| priority | INT | Obrigatório, Único | Prioridade da categoria. Quanto menor, mais prioritário será. |

### 3.2 Product
| Atributo | Tipo | Propriedades | Descrição |
| :--- | :--- | :--- | :--- |
| id | INT | PK, Auto-increment, Obrigatório | Identificador único da tupla, automaticamente atribuído pelo SGBD. |
| category | INT | Obrigatório, FK | Chave estrangeira da categoria a qual o produto pertence. |
| european_article_number | VARCHAR(20) | Obrigatório, Único | Código EAN do produto. |
| name | VARCHAR(50) | Obrigatório | Nome do produto. |
| brand | VARCHAR(50) | Obrigatório | Marca do produto. |
| measurement | DECIMAL(10, 2) | Obrigatório | Medição/Quantidade do produto. |
| measurement_unit | ENUM(‘KG’, ‘G’, ‘L’, ‘ML’, ‘UN’) | Obrigatório | Unidade de medida do produto, podendo ser: KG (Quilo), G (Grama), L (Litro), ML (Mililitro), UN (Unidade). |
| image | - | Opcional | Imagem/Foto do Produto |

### 3.3 BranchSupermarket
| Atributo | Tipo | Propriedades | Descrição |
| :--- | :--- | :--- | :--- |
| id | INT | PK, Auto-increment, Obrigatório | Identificador único da tupla, automaticamente atribuído pelo SGBD. |
| parent_supermarket | INT | Obrigatório, FK | Chave estrangeira que referencia o Mercado Matriz (ParentSupermarket). |
| coordinates | POINT | Obrigatório, Único | Objeto **Point** que representa as coordenadas geográficas do mercado (latitude/longitude) |
| state | CHAR(2) | Obrigatório | Sigla do estado em que o mercado está localizado. |
| city | VARCHAR(50) | Obrigatório | Nome da cidade em que o mercado está localizado. |

### 3.4 ParentSupermarket
| Atributo | Tipo | Propriedades | Descrição |
| :--- | :--- | :--- | :--- |
| id | INT | PK, Auto-increment, Obrigatório | Identificador único da tupla, automaticamente atribuído pelo SGBD. |
| name | VARCHAR(100) | Obrigatório, Único | É o nome do mercado matriz. |

### 3.5 Offer
| Atributo | Tipo | Propriedades | Descrição |
| :--- | :--- | :--- | :--- |
| id | INT | PK, Auto-increment, Obrigatório | Identificador único da tupla, automaticamente atribuído pelo SGBD. |
| url | VARCHAR(2083) | Obrigatório, Único | É a URL de onde este panfleto de mercado foi extraído. |
| expiration_date | DATE | Obrigatório | É a data em que esta oferta expirará. |

### 3.6 Report
| Atributo | Tipo | Propriedades | Descrição |
| :--- | :--- | :--- | :--- |
| id | INT | PK, Auto-increment, Obrigatório | Identificador único da tupla, automaticamente atribuído pelo SGBD. |
| offer | INT | Obrigatório, FK | Referencia a oferta que a denúncia trata. |
| device_id | VARCHAR(255) | Obrigatório | É o código do celular da pessoa que realizou a denúncia. |
| reason | ENUM('WP', 'NP', 'EO', 'O') | Obrigatório | É o motivo da denúncia, podendo ser: Preço Errado (WP), Produto Inexistente (NP), Oferta Expirada (EO), Outros (O). |
| description | VARCHAR(500) | Opcional | É a descrição da denúncia. |
| status | ENUM('R', 'P', 'G') | Obrigatório | Status da denúncia, podendo ser: Resolvida (R), Pendente (P), Improcedente (G). |
| creation_date | DATETIME | Obrigatório | É a data em que a denúncia foi realizada. |

### 3.7 BranchProductOffer
| Atributo | Tipo | Propriedades | Descrição |
| :--- | :--- | :--- | :--- |
| id | INT | PK, Auto-increment, Obrigatório | Identificador único da tupla, automaticamente atribuído pelo SGBD. |
| offer | INT | Obrigatório, FK | Chave estrangeira que identifica a oferta de origem. |
| branch_supermarket | INT | Obrigatório, FK | Chave estrangeira que identifica o supermercado filial de origem. |
| product | INT | Obrigatório, FK | Chave estrangeira que identifica o produto de origem. |
| price | DECIMAL(10, 2) | Obrigatório | É o preço do produto no momento em que a oferta foi recuperada. |
