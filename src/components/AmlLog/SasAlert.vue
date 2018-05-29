<template>
  <div class="sas-alert">
    <div class="row">
      <div class="col-md-offset-1 col-md-10">
        <!-- <code>query: {{ query }}</code> -->
        <datatable v-bind="$data" />
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Datatable from 'vue2-datatable-component'
import axios from 'axios'
// import moment from 'moment'
// import uniq from 'lodash/uniq'
import orderBy from 'lodash/orderBy'

Vue.use(Datatable)
export default {
  name: 'sas-alert',
  data: () => ({
    columns: [
      { title: 'PARTY_FULL_NM', field: 'PARTY_FULL_NM', sortable: true },
      { title: 'INCIDENT_ID', field: 'INCIDENT_ID', sortable: true },
      { title: 'PARTY_ID', field: 'PARTY_ID', sortable: true },
      { title: 'ACTUAL_VALUES_TEXT', field: 'ACTUAL_VALUES_TEXT' },
      { title: 'INCIDENT_CATEFORY_CD', field: 'INCIDENT_CATEFORY_CD' },
      { title: 'INCIDENT_SUBCATEGORY_CD', field: 'INCIDENT_SUBCATEGORY_CD'}
    ],
    data: [],
    total: 10,
    query: {},
    allData: []
  }),
  mounted () {
    axios.get('/api/ecm/avaiable-alert')
    .then((resp) => {
        this.total = resp.data.length
        this.allData = resp.data
    })
    .catch((err) => {
        console.log(err)
    })
  },
  methods: {
    mockData (query,rows) {
        console.log(query);
        console.log(rows);
        const typeOf = o => Object.prototype.toString.call(o).slice(8, -1).toLowerCase()
        let limit = query.limit
        let offset = query.offset
        let sort = query.sort
        let order = query.order
        let columns = ['PARTY_FULL_NM', 'INCIDENT_ID', 'PARTY_ID' , 'ACTUAL_VALUES_TEXT','INCIDENT_CATEFORY_CD','INCIDENT_SUBCATEGORY_CD']

        columns.forEach(function(field){
          switch (typeOf(query[field])) {
            case 'array':
              rows = rows.filter(row => query[field].includes(row[field]))
              break
            case 'string':
              rows = rows.filter(row => row[field].toLowerCase().includes(query[field].toLowerCase()))
              break
            default:
              // nothing to do
              break
          }
        })

        if (sort) {
          rows = orderBy(rows, sort, order)
        }

        const res = {
          rows: rows.slice(offset, offset + limit),
          total: rows.length,
          summary: {

          }
        }
        this.data = res.rows
        this.total = res.total
    }
  },
  watch: {
    query: {
      handler (query) {
        // this.mockData(query,this.data)
        // .then(({ rows, total }) => {
        //   console.log(rows)
        //   this.data = rows
        //   this.total = total
        // })
        this.mockData(query,this.allData)
      },
      deep: true
    },
    allData: {
      handler (allData) {
        this.mockData(this.query,allData)
      }
    }
  }
}
</script>
