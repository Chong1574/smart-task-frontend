const text = 
Here is the JSON:
{
  "description": "Un caldero magico para Halloween!",
  "category": "Decoracion",
  "hashtags": ["magia", "halloween"]
}
;
const match = text.match(/\{.*\}/s);
console.log(match ? match[0] : 'No match');
