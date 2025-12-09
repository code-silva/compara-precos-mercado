# 👤 Arquitetura

!!! note "OBS"
    A seguinte arquitetura está sujeita a alterações de acordo com o desenvolver do projeto, onde podem ser exploradas possíveis melhorias.

    * Fique atento as novas atualizações.

[Altere a seguinte Arquitetura aqui](https://excalidraw.com/#room=4df017c8a4b515a8cac6,Q6P3RxNnlMaJP3La_ZXlIw)

![Diagrama de Arquitetura do Projeto](https://raw.githubusercontent.com/code-silva/compara-precos-mercado/refs/heads/main/docs/img/arquitetura_modulos_black.png)

## 1. Visão Geral

O sistema é construído sobre o **Framework Django**, adaptando sua estrutura padrão (MVT) para um design **Monolítico Modular**. Essa abordagem centraliza a gestão de dados enquanto desacopla processos pesados e assíncronos.

### Por que Monolito Modular?

| Vantagem | Descrição |
| :--- | :--- |
| **Agilidade** | Ideal para a equipe - que é pequena - e é simples de implementar. |
| **Baixo Custo** | Custos reduzidos pois não há a necessidade de realizar deploy de diversos servidores. |
| **Baixo Tráfego** | Ideal para a aplicação, considerando que não há expectativa de tráfego alto no momento. |

---

## 2. Stack Tecnológica

Para garantir performance em um cenário de **leitura intensiva** (*read-heavy*) e processamento de imagens, utilizamos os seguintes componentes:

### ⚡ Processamento e Fila
* **[Celery](https://docs.celeryq.dev/):** Gerenciador de tarefas distribuídas. Responsável por executar os módulos de *Scraping*, *OCR (IA)* e *Recorte de Imagens* sem bloquear a API principal.
* **[Redis (Broker)](https://redis.io/):** Atua como canal de mensageria, transportando as tarefas da API Django para os Workers do Celery com latência mínima.

### 💾 Persistência e Cache
* **[Redis (Cache)](https://redis.io/):** Implementa a estratégia **Cache-First**. Permite armazenar os dados frequentemente consultados em cache, reduzindo o número de operações de I/O no banco principal.
* **Storage (S3/Local):** Responsável por guardar imagens brutas (panfletos) e processadas (recortes), retirando a carga pesada do banco de dados principal.