from pydantic import BaseModel, ConfigDict


class TherapistCreate(BaseModel):
    name: str
    phone: str | None = None
    email: str | None = None

    status: str = "active"


class TherapistUpdate(BaseModel):
    name: str | None = None
    phone: str | None = None
    email: str | None = None

    status: str | None = None


class TherapistResponse(BaseModel):
    id: int

    name: str
    phone: str | None
    email: str | None

    status: str

    account_type: str

    model_config = ConfigDict(
        from_attributes=True
    )