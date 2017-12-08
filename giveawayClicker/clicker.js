async class Clicker {
  constructor(id){
    this._id = id
    this._requirement
  }
  static participateGiveaway(id){

  }
  
  async detectRequirements(){
    this._requirement = await detectRequirements(this._id)
    return this._requirement
  }


}