dir="third_party"
init:
	if [ -d ${dir} ]; then echo "Directory ${dir} already existed, bypass clone modules and continue to generate!"; \
  else \
    rm -f -r ${dir}; \
	  mkdir ${dir}; \
		cd ${dir}; \
		echo "Cloning modules to ${dir}"; \
		git clone https://github.com/grpc-ecosystem/grpc-gateway; \
		git clone https://github.com/googleapis/googleapis; \
  fi;
INC=-I/home/${USER}/include -I. \
		-I./third_party/googleapis \
		-I./openapis \
		-I./third_party/grpc-gateway \

swaggers:
	rm -f -r generated
	mkdir generated
	protoc --include_source_info --include_imports ${INC} \
		   --openapiv2_out=logtostderr=true,json_names_for_fields=false:generated/ \
		openapis/promotion/v1/promotion.proto