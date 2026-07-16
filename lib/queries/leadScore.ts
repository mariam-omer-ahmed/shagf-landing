export function calculateLeadScore(lead:any){

let score = 0;


// اختار باقة
if(lead.selected_package){
score += 30;
}


// لديه هدف واضح
if(lead.goal){
score += 20;
}


// أكمل الجاهزية
if(lead.readiness){
score += 30;
}


// لديه نشاط حديث
if(lead.last_activity_at){
score += 20;
}


return score;

}