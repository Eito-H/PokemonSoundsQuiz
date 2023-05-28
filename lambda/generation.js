module.exports.get_no = (generation) => {
    switch(generation) {
        case 2:
            return { 'min_no': 152, 'max_no' : 251 }
        case 3:
            return { 'min_no': 252, 'max_no' : 386 }
        case 4:
            return { 'min_no': 387, 'max_no' : 493 }
        case 5:
            return { 'min_no': 494, 'max_no' : 649 }
        case 6:
            return { 'min_no': 650, 'max_no' : 721 }
        case 7:
            return { 'min_no': 722, 'max_no' : 809 }
        case 8:
            return { 'min_no': 810, 'max_no' : 898 }
        case 'arceus':
            return { 'min_no': 899, 'max_no' : 905 }
        case 9:
            return { 'min_no': 906, 'max_no' : 1008 }
        default:
            return { 'min_no': 1, 'max_no' : 151 }
   }
}