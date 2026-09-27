from pydantic import BaseModel, ConfigDict


class PatientCreate(BaseModel):
    name: str
    phone: str
    age: int | None = None
    gender: str | None = None
    address: str | None = None
    condition: str | None = None
    therapist_id: int | None = None
    package: str | None = None
    status: str = "active"


class PatientUpdate(BaseModel):
    name: str | None = None
    phone: str | None = None
    age: int | None = None
    gender: str | None = None
    address: str | None = None
    condition: str | None = None
    therapist_id: int | None = None
    package: str | None = None
    status: str | None = None


class PatientResponse(BaseModel):
    id: int
    name: str
    phone: str
    age: int | None
    gender: str | None
    address: str | None
    condition: str | None
    therapist_id: int | None
    package: str | None
    status: str

    model_config = ConfigDict(
        from_attributes=True
    )