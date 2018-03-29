<template>
    <nav class="navbar navbar-default">
        <div class="container-fluid">
            <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#HomeNavbar">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>                        
            </button>
            <a class="navbar-brand" href="#">{{title}}</a>
            </div>
            <div class="collapse navbar-collapse" id="HomeNavbar">
            <ul class="nav navbar-nav">
                <li><router-link to="./">首頁</router-link></li>                                             
                <li><router-link to="./SasLog">SasLog</router-link></li>      
                <li><router-link to="./PrimeLog">PrimeLog</router-link></li>                                             
                                                       
                <!-- <li><router-link to="./BuyTemplate">買山豬模板</router-link></li> 
                <li><router-link to="./BuyPig">買山豬</router-link></li>             
                <li><router-link to="./BuyPigCombineComponents">買山豬組合模板</router-link></li>                        -->
            </ul>
            </div>
        </div>
    </nav>
</template>

<script>
export default {
  name: 'NavBar',
  data () {
    return {
      title: '小工具'
    }
  }
}
</script>

