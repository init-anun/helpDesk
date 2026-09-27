from pydantic import BaseModel, ConfigDict


class TherapistCreate(BaseModel):
    name: str
    phone: str | None = None
    email: str | None = None


class TherapistUpdate(BaseModel):
    name: str | None = None
    phone: str | None = None
    email: str | None = None


class TherapistResponse(BaseModel):
    id: int
    name: str
    phone: str | None
    email: str | None

    model_config = ConfigDict(
        from_attributes=True
    )