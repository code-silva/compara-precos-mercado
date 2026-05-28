import unicodedata


def remove_accents(text: str) -> str:
    """
    Returns the string without any accents.
    """

    if not text:
        return ""

    return "".join(
        c for c in unicodedata.normalize("NFKD", text)
        if not unicodedata.combining(c)
    )